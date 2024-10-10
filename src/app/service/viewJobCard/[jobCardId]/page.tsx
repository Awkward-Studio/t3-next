import React from "react";

type Props = {};

export default function ViewJobCard({
  params,
}: {
  params: { jobCardId: any };
}) {
  return <div>JobCard - {params.jobCardId}</div>;
}
