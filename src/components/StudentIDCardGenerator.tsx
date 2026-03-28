import React, { useRef, useState, useEffect, useImperativeHandle } from 'react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
// import QRCode from 'qrcode.react';
import './id-card.css';
import { Download } from 'lucide-react';

interface Student {
	name: string;
	id: string;
	level: string;
	qrUrl: string;
	photoUrl?: string;
	department: string;
	yearOfEntry: string;
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

// Helper function to calculate responsive font size based on character count
const getResponsiveFontSize = (text: string, baseSize: number, minSize: number = 0.8): string => {
	const charCount = text.length;
	// Reduce font size as character count increases
	// At 30 chars, reaches minSize; above 30 stays at minSize
	const reductionFactor = Math.min(charCount / 30, 1);
	const fontSize = Math.max(minSize, baseSize - (baseSize - minSize) * reductionFactor);
	return `${fontSize}rem`;
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
						width: '680px',
						height: '1050px',
						backgroundColor: '#ffffff',
						display: 'flex',
						flexDirection: 'column',
						transform: 'scale(0.5)',
						transformOrigin: 'top left',
						fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
						boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
						border: '1px solid #e5e7eb',
						overflow: 'hidden'
					}}
				>
					{currentStudent && (
						<>
							{/* TOP SECTION - Photo and Logo */}
							<div style={{
								backgroundColor: '#f8fafc',
								padding: '1.5rem',
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								borderBottom: '2px solid #e5e7eb'
							}}>
								{/* School Logo */}
								<div style={{
									width: '100px',
									height: '100px',
									marginBottom: '1.5rem',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center'
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
									width: '220px',
									height: '280px',
									backgroundColor: '#ffffff',
									padding: '8px',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									flexShrink: 0,
									borderRadius: '6px',
									border: '2px solid #d1d5db',
									boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
								}}>
									<img
										src={currentStudent.photoUrl || 'https://placehold.co/600x400'}
										alt="Student Photo"
										style={{
											width: '100%',
											height: '100%',
											objectFit: 'cover',
											display: 'block',
											borderRadius: '4px'
										}}
									/>
								</div>
							</div>

							{/* BOTTOM SECTION - Student Info and QR Code */}
							<div style={{
								flex: 1,
								backgroundColor: '#ffffff',
								padding: '1.5rem',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								color: '#1f2937',
								boxSizing: 'border-box'
							}}>
								{/* Top Section - Student Name and Details */}
								<div>
									{/* Header Line */}
									<div style={{
										height: '3px',
										backgroundColor: '#0052cc',
										marginBottom: '0.8rem',
										borderRadius: '2px'
									}}></div>

									{/* Student Name - Prominent */}
									<h2 style={{
										fontSize: getResponsiveFontSize(currentStudent.name, 2.8),
										fontWeight: '900',
										margin: '0 0 1.2rem 0',
										textTransform: 'uppercase',
										letterSpacing: '1.5px',
										color: '#0052cc',
										lineHeight: '1.2',
										textAlign: 'center'
									}}>
										{currentStudent.name}
									</h2>

									{/* Student Details */}
									<div style={{
										fontSize: '1rem',
										lineHeight: '1.4rem',
										fontWeight: '600',
										textTransform: 'uppercase',
										letterSpacing: '0.5px',
										color: '#374151'
									}}>
										<div style={{ 
											marginBottom: '0.5rem',
											paddingBottom: '0.5rem',
											borderBottom: '1px solid #e5e7eb'
										}}>
											<p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#666' }}>MATRIC NO</p>
											<p style={{ margin: '0', fontWeight: '700', fontSize: '1.05rem' }}>{currentStudent.id}</p>
										</div>
										<div style={{ 
											marginBottom: '0.5rem',
											paddingBottom: '0.5rem',
											borderBottom: '1px solid #e5e7eb'
										}}>
											<p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#666' }}>DEPARTMENT</p>
											<p style={{ margin: '0', fontWeight: '700', fontSize: '0.95rem' }}>{currentStudent.department}</p>
										</div>
										<div style={{ 
											marginBottom: '0.5rem',
											paddingBottom: '0.5rem',
											borderBottom: '1px solid #e5e7eb'
										}}>
											<p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#666' }}>YEAR OF ENTRY</p>
											<p style={{ margin: '0', fontWeight: '700', fontSize: '0.95rem' }}>{currentStudent.yearOfEntry}</p>
										</div>
										<div>
											<p style={{ margin: '0.2rem 0', fontSize: '0.85rem', color: '#666' }}>EXPIRY DATE</p>
											<p style={{ margin: '0', fontWeight: '700', fontSize: '0.95rem' }}>N/A</p>
										</div>
									</div>
								</div>

								{/* Bottom Section - QR Code and Label */}
								<div style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									paddingTop: '1rem',
									borderTop: '2px solid #e5e7eb'
								}}>
									{/* QR Code */}
									<div style={{
										backgroundColor: '#ffffff',
										padding: '8px',
										borderRadius: '8px',
										border: '2px solid #0052cc',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										marginBottom: '0.5rem'
									}}>
										<img
											src={'/omackqrcode.jpeg'}
											alt="QR Code"
											style={{
												width: '160px',
												height: '160px',
												display: 'block'
											}}
										/>
									</div>
									<p style={{
										fontSize: '1rem',
										fontWeight: '900',
										color: '#0052cc',
										margin: '0',
										letterSpacing: '1px'
									}}>SCAN ID</p>
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