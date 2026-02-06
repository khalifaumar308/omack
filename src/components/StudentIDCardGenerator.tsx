import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import './id-card.css';
import { Download } from 'lucide-react';

interface Student {
	name: string;
	id: string;
	level: string;
	qrUrl: string;
	photoUrl?: string;
	department: string;
}

interface School {
	name: string;
	logoUrl: string;
}

interface StudentIDCardGeneratorProps {
	students: Student[];
	school: School;
}
export type StudentIDCardGeneratorHandle = {
	download: (student: Student, format: 'png' | 'pdf') => void;
};

const StudentIDCardGenerator = React.forwardRef<StudentIDCardGeneratorHandle, StudentIDCardGeneratorProps>(
	({ students, school }, ref) => {
	const cardRef = useRef<HTMLDivElement>(null);
	const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
	const [format, setFormat] = useState<'png' | 'pdf' | 'batch-png' | 'batch-pdf' | null>(null);
	const [batchIndex, setBatchIndex] = useState<number>(0);

	useImperativeHandle(ref, () => ({
		download: (student: Student, fmt: 'png' | 'pdf') => {
			setCurrentStudent(student);
			setFormat(fmt);
		}
	}));

	// Handle single card download
	const handleDownload = (student: Student, downloadFormat: 'png' | 'pdf') => {
		setCurrentStudent(student);
		setFormat(downloadFormat);
	};

	// Handle batch download
	const handleBatchDownload = (downloadFormat: 'batch-png' | 'batch-pdf') => {
		if (students.length === 0) return;
		// start from first student
		setBatchIndex(0);
		setCurrentStudent(students[0]);
		setFormat(downloadFormat);
	};

	// Process downloads (single or batch)
	useEffect(() => {
		if (!currentStudent || !format || !cardRef.current) return;

		const exportCard = async () => {
			try {
				// Type guard for cardRef.current
				if (!cardRef.current) {
					throw new Error('Card reference is null');
				}

				// Try to inline/cors images to avoid tainted canvas
				const imgs = Array.from(cardRef.current.querySelectorAll('img')) as HTMLImageElement[];
				// Save original srcs to restore later
				const originalSrcs = imgs.map((i) => i.src);

				for (const img of imgs) {
					try {
						// prefer to set crossOrigin and fetch as blob then convert to data URL
						img.crossOrigin = 'anonymous';
						const res = await fetch(img.src, { mode: 'cors' });
						if (res.ok) {
							const blob = await res.blob();
							const dataUrl = await new Promise<string>((resolve, reject) => {
								const reader = new FileReader();
								reader.onload = () => resolve(reader.result as string);
								reader.onerror = reject;
								reader.readAsDataURL(blob);
							});
							img.src = dataUrl;
						}
					} catch (e) {
						// If fetch fails, leave img.src as-is. It may still taint the canvas if the host doesn't allow CORS.
						console.warn('Could not inline image for export (may cause tainted canvas):', img.src, e);
					}
				}

				const canvas = await html2canvas(cardRef.current, {
					useCORS: true,
					allowTaint: false,
					scale: window.devicePixelRatio || 1,
				});

				if (format === 'png' || format === 'batch-png') {
					const link = document.createElement('a');
					link.download = `${currentStudent.name.replace(/\s+/g, '-')}-id-card.png`;
					try {
						link.href = canvas.toDataURL('image/png');
					} catch (err) {
						console.error('toDataURL failed (canvas may be tainted):', err);
						window.alert('Export failed: some images are served without CORS headers which prevents exporting the card. Ensure images (logo/photo) are served with Access-Control-Allow-Origin or are same-origin.');
						// restore original srcs
						imgs.forEach((i, idx) => (i.src = originalSrcs[idx]));
						setCurrentStudent(null);
						setFormat(null);
						return;
					}
					link.click();
				} else if (format === 'pdf' || format === 'batch-pdf') {
					const imgData = canvas.toDataURL('image/png');
					const pdf = new jsPDF({
						orientation: 'landscape',
						unit: 'mm',
						format: [100, 60],
					});

					// Calculate image dimensions
					const img = new Image();
					img.src = imgData;
					await new Promise((resolve) => {
						img.onload = resolve;
					});
					const imgWidth = img.width;
					const imgHeight = img.height;
					const pdfWidth = pdf.internal.pageSize.getWidth();
					const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

					pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
					pdf.save(`${currentStudent.name.replace(/\s+/g, '-')}-id-card.pdf`);
				}

				// restore original srcs (important if we inlined images)
				imgs.forEach((i, idx) => (i.src = originalSrcs[idx]));

				// Handle batch processing
				if ((format === 'batch-png' || format === 'batch-pdf') && batchIndex < students.length - 1) {
					setTimeout(() => {
						setCurrentStudent(students[batchIndex + 1]);
						setBatchIndex(batchIndex + 1);
					}, 500); // Delay for browser stability
				} else {
					// Reset after single or batch completion
					setCurrentStudent(null);
					setFormat(null);
					setBatchIndex(0);
				}
			} catch (error) {
				console.error('Error generating card:', error);
			}
		};

		exportCard();
	}, [currentStudent, format, batchIndex, students]);

	return (
		<div className="">
			<div className="items-center">
				{
					students.length > 1 && (

						<button
							onClick={() => handleBatchDownload('batch-png')}
							className="batch-button-png flex items-center gap-1"
							disabled={format !== null || students.length === 0}
							title="Download all student ID cards as PNG"
						>
							<Download /> 
							<p className='hidden sm:flex'>ID Cards</p>
						</button>
					)
				}
				{format && (format === 'batch-png' || format === 'batch-pdf') && (
					<div className="ml-4 text-sm">
						Processing {batchIndex + 1} / {students.length}
					</div>
				)}
			</div>
				{students.length === 1 && (
					<button
								onClick={() => handleDownload(students[0], 'png')}
								className="download-button-png"
								disabled={format !== null}
							>
								<Download />
							</button>
				)}

			{/* Hidden Card Template for Export */}
			<div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
				<div
					ref={cardRef}
					style={{
						width: '700px',
						height: '1000px',
						padding: '2rem',
						backgroundColor: '#e6f3ff',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						color: '#222222',
						transform: 'scale(0.5)',
						transformOrigin: 'top left',
						fontFamily: 'Arial, sans-serif'
					}}
				>
					{currentStudent && (
						<>
							{/* School Logo */}
							<div style={{
								width: '200px',
								height: '200px',
								marginBottom: '2rem',
								display: 'flex',
								justifyContent: 'center'
							}}>
								<img
									src={school.logoUrl || 'https://placehold.co/600x400'}
									alt="School Logo"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'contain'
									}}
								/>
							</div>

							{/* Student Photo */}
							<div style={{
								width: '300px',
								height: '350px',
								marginBottom: '2rem',
								backgroundColor: '#fff',
								padding: '0.5rem'
							}}>
								<img
									src={currentStudent.photoUrl || 'https://placehold.co/600x400'}
									alt="Student Photo"
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover'
									}}
								/>
							</div>

							{/* Student Details */}
							<div style={{
								width: '100%',
								textAlign: 'center',
								marginBottom: '1.5rem'
							}}>
								<h2 style={{
									fontSize: '2.5rem',
									fontWeight: 'bold',
									color: '#0066cc',
									marginBottom: '0.5rem',
									textTransform: 'uppercase'
								}}>{currentStudent.name}</h2>

								<div style={{
									fontSize: '1.5rem',
									lineHeight: '2.5rem',
									color: '#000',
									textTransform: 'uppercase'
								}}>
									<p style={{ margin: '0.5rem 0' }}>MATRIC NO: {currentStudent.id}</p>
									<p style={{ margin: '0.5rem 0' }}>LEVEL: {currentStudent.level}</p>
									<p style={{ margin: '0.5rem 0' }}>DEPARTMENT: {currentStudent.department}</p>
									{/* <p style={{ margin: '0.5rem 0' }}>YEAR OF ENTRY: 2024/2025</p> */}
								</div>

								{/* Expiry Date */}
								{/* <p style={{
                  color: '#0066cc',
                  fontSize: '1.25rem',
                  marginTop: '1.5rem'
                }}>Expiry Date: September 2026</p> */}

								{/* QR Code - Small and centered */}
								<div style={{
									marginTop: '1rem',
									display: 'flex',
									justifyContent: 'center'
								}}>
									<QRCodeSVG
										value={"https://portal.omarkschoolofhealth.ng/student/"}
										size={120}
										level="H"
										bgColor="#ffffff"
										style={{ padding: '0.25rem' }}
									/>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
	}
);

export default StudentIDCardGenerator;