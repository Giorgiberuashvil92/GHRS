import TeacherInfo from "../../components/TeacherInfo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      <TeacherInfo instructorId={id} />
    </div>
  );
} 