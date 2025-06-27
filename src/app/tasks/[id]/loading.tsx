import { LoadingSkeleton } from "@/components/loader/LoadingSkeleton";

const loading = () => {
  return (
    <>
      {" "}
      <LoadingSkeleton rows={6} columns={5} />
    </>
  );
};

export default loading;
