import React, { use } from "react";
import PersonalAccount from "../../page";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UserPage = ({ params }: Props) => {
  const userId = use(params).id;

  return <PersonalAccount />;
};

export default UserPage;
