import { api } from "@/api/api";
import { Alltags } from "@/utils/dataTags";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

function About() {
  const { bookId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`book_${bookId}`],
    queryFn: async () => {
      const response = await api.get(`books/${bookId}`);
      return await response.data;
    },
  });

  function getLabelsByValues(values: string[]) {
    return Alltags.flatMap((group) =>
      group.tags
        .filter((tag) => values.includes(tag.value))
        .map((tag) => tag.label)
    );
  }

  if (isLoading) {
    return (
      <div className="p-12">
        <div className="flex gap-8 ">
          <div className="w-64 h-96 rounded bg-neutral-900 animate-pulse"></div>
          <div className="flex flex-col gap-10">
            <div className="w-56 h-6 bg-neutral-900 rounded-lg"></div>
            <div className="w-56 h-6 bg-neutral-900 rounded-lg"></div>
            <div className="w-56 h-6 bg-neutral-900 rounded-lg"></div>
            <div className="w-56 h-6 bg-neutral-900 rounded-lg"></div>
            <div className="w-56 h-6 bg-neutral-900 rounded-lg"></div>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <div className="w-[90rem] h-6 bg-neutral-900 rounded-lg"></div>
          <div className="w-[90rem] h-6 bg-neutral-900 rounded-lg"></div>
          <div className="w-[90rem] h-6 bg-neutral-900 rounded-lg"></div>
          <div className="w-[90rem] h-6 bg-neutral-900 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <div className=" text-white flex gap-8 ">
        <img src={data.book.Cover} className="w-64 h-96 rounded" />
        <div className="flex flex-col gap-10">
          <h1 className="font-sans text-3xl font-bold">{data.book.Name}</h1>
          <p className="font-sans text-lg">
            Publisher: <b className="font-bold">{data.book.Publisher}</b>
          </p>
          <p className="font-sans text-lg">
            Year: <b className="font-bold">{data.book.Year}</b>
          </p>
          <p className="font-sans text-lg">
            Author:{" "}
            {data.book.author.map((author: string[]) => (
              <b className="font-bold">{author}, </b>
            ))}
          </p>
          <p className="font-sans text-lg">
            tags:{" "}
            {getLabelsByValues(data.book.tags).map((tag) => (
              <b className="font-bold">{tag}, </b>
            ))}
          </p>
        </div>
      </div>
      <p className="text-white mt-8  text-lg">{data.book.Descripition}</p>
    </div>
  );
}

export default About;
