import { BookType } from "@/types/book";
import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { api } from "@/api/api";

function All() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["booksAll"],
    queryFn: async () => {
      const response = await api.get("books");
      return (await response.data) as { books: BookType[] };
    },
    staleTime: Infinity,
    refetchOnMount: false,
  });

  if (isLoading) {
    const numberOfElements = 40;
    const items = Array.from(
      { length: numberOfElements },
      (_, index) => index + 1
    );
    return (
      <div className="p-8 flex gap-4 flex-wrap">
        {items.map((_) => (
          <div
            className="w-36 h-52 bg-neutral-900 rounded-md animate-pulse"
            key={_}
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 ">
      <div className="flex gap-4 flex-wrap">
        {data?.books?.map((book: BookType) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1 } }}
          >
            <div
              className="w-36 h-52 hover:cursor-pointer transition ease-in-out delay-50 hover:scale-110  duration-300"
              aria-label=""
              onClick={() => navigate(`/books/${book.ID}`)}
            >
              <img
                src={book.Cover}
                alt={String(book.Cover)}
                className="w-full h-full rounded-md"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default All;
