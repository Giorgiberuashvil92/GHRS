import TeacherInfo from "../../components/TeacherInfo";

interface PageProps {
  params: {
    id: string;
  };
}

export default function TeacherPage({ params }: PageProps) {
  return <TeacherInfo instructorId={params.id} />;
} 