import Certificate from "@/app/components/Certificate";
import TeacherInfo from "../../components/TeacherInfo";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TeacherPage({ params }: PageProps) {
  return <div>
    <TeacherInfo instructorId={params.id} />
  </div>
} 