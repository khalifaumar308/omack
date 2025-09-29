import { useUser } from "@/contexts/useUser"

const StudentProfile = () => {
  const {user} = useUser();
  return (
    <div>{JSON.stringify(user)}</div>
  )
}

export default StudentProfile