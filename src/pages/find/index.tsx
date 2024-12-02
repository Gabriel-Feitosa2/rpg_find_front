/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alltags } from "../../utils/dataTags";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  QuestionMarkCircledIcon,
  OpenInNewWindowIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { api } from "@/api/api";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { BookType } from "@/types/book";

import { useNavigate } from "react-router-dom";
import { pipeline } from "@huggingface/transformers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { api } from "@/api/api";

function Find() {
  const [direction, setDirection] = useState(0);
  const [selectTags, setSelectTags] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);

  const navigate = useNavigate();

  const { mutate, isPending, data, isSuccess } = useMutation({
    mutationFn: async (tags: string[]) => {
      const response = await api.post("/books/tags", {
        tags: tags,
        ContainsAllTags: direction === 1 ? true : false,
      });
      return (await response.data) as { books: BookType[] };
    },
  });

  const handleTabChange = (next: string) => {
    setDirection(next === "find" ? 0 : 1);
  };

  const checkTags = (tag: string) => {
    if (selectTags.find((selectTag) => selectTag === tag)) {
      const arrayFilter = selectTags.filter((tags) => tags !== tag);
      setSelectTags(arrayFilter);
      return;
    }
    setSelectTags([...selectTags, tag]);
  };

  const getTagsValues = () => {
    const array: string[] = [];
    Alltags[0].tags.map((tag) => array.push(tag.value));
    return array;
  };

  const findRpg = async () => {
    setLoadingButton(true);
    try {
      const classifier = await pipeline(
        "zero-shot-classification",
        "Xenova/nli-deberta-v3-xsmall"
      );

      const labels = getTagsValues();
      const output: any = await classifier(search, labels);
      const mutateDate = [output.labels[0], output.labels[1], output.labels[2]];
      mutate(mutateDate);
    } finally {
      setLoadingButton(false);
    }
  };

  useEffect(() => {
    window.scrollBy(0, 2000);
  }, [isSuccess]);

  return (
    <>
      <div className="p-8 w-full flex justify-center items-center flex-col text-white gap-2">
        <Tabs
          defaultValue="find"
          onValueChange={(next) => handleTabChange(next)}
          className="flex justify-center items-center flex-col gap-4"
        >
          <TabsList className="transition delay-150 duration-150 ease-in-out w-64">
            <TabsTrigger value="find">Find</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>
          <TabsContent value="find">
            <motion.div
              initial={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative w-80">
                <Input
                  type="text"
                  placeholder="What RPG do you want to play ?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="absolute top-1/2 right-3 -translate-y-1/2">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="manual">
            <motion.div
              initial={{ opacity: 0, x: direction === 1 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction === 1 ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <h1 className="text-white font-sans text-3xl font-bold">
                Select Filters
              </h1>
              <h1>Select what you would like in the system</h1>
              <div className="h-[42rem] rounded-md border">
                {Alltags.map((filter) => (
                  <div className="min-h-32 flex flex-col gap-2 p-2">
                    <div className="flex items-center justify-between">
                      <h1 className="font-bold">{filter.title}</h1>
                      <Popover>
                        <PopoverTrigger>
                          <div className="flex justify-center items-center w-5 h-5 hover:bg-neutral-600 rounded-full cursor-pointer">
                            <QuestionMarkCircledIcon className="h-4 w-4 " />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          className=" text-xs bg-neutral-800 font-bold border-neutral-950 text-white"
                        >
                          {filter.description === "style" ? (
                            <h1>
                              Game style based on{" "}
                              <a
                                href="https://en.wikipedia.org/wiki/GNS_theory"
                                target="_blank"
                                className="text-blue-600 dark:text-blue-500 underline"
                              >
                                GNS theory <OpenInNewWindowIcon />
                              </a>
                            </h1>
                          ) : (
                            filter.description
                          )}
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Separator />
                    <div className="flex gap-2 flex-wrap">
                      {filter.tags.map((tags) => (
                        <Badge
                          variant={
                            selectTags.includes(tags.value)
                              ? "secondary"
                              : "outlineHover"
                          }
                          className={`${
                            selectTags.includes(tags.value)
                              ? "text-black"
                              : "text-white"
                          } hover:cursor-pointer`}
                          onClick={() => checkTags(tags.value)}
                        >
                          {tags.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-center">
        <div className="flex justify-end ">
          <Button
            variant="secondary"
            size="lg"
            onClick={() => (direction === 0 ? findRpg() : mutate(selectTags))}
            disabled={isPending || loadingButton}
          >
            {isPending || loadingButton ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Find Game"
            )}
          </Button>
        </div>
      </div>
      {data && (
        <div className="flex justify-center mt-12 mb-12 p-12 gap-4 flex-wrap">
          {data?.books?.map((book: BookType) => (
            <div
              className="w-36 h-52 hover:cursor-pointer transition ease-in-out delay-50 hover:scale-110  duration-300"
              onClick={() => navigate(`/books/${book.ID}`)}
            >
              <img
                src={book.Cover}
                alt={String(book.Cover)}
                className="w-full h-full rounded-md"
              />
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Find;
