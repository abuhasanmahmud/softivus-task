import { LoadingSkeleton } from "@/components/loader/LoadingSkeleton";

const loading = () => {
  return (
    <>
      <LoadingSkeleton rows={3} columns={1} />
    </>
  );
};

export default loading;
