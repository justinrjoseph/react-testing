import { Select, Skeleton } from "@radix-ui/themes";

import axios from "axios";
import { useQuery } from "react-query";

import { Category } from "../entities";

interface Props {
  selectCategoryId: (id: number) => void;
}

function CategorySelect({ selectCategoryId }: Props): JSX.Element | null {
  const { isLoading, error, data: categories } = useQuery<Category[], Error, Category[]>({
    queryKey: ['categories'],
    queryFn: () => axios.get<Category[]>("/categories").then((res) => res.data)
  });

  if (isLoading) {
    return (
      <p role="progressbar" aria-label="Loading categories">
        <Skeleton />
      </p>
    );
  }
  if (error) return null;

  return (
    <Select.Root
      onValueChange={(categoryId) => selectCategoryId(+categoryId) }>
      <Select.Trigger placeholder="Filter by Category" />
      <Select.Content>
        <Select.Group>
          <Select.Label>Category</Select.Label>
          <Select.Item value="all">All</Select.Item>
          {categories?.map((category) => (
            <Select.Item key={category.id} value={category.id.toString()}>
              {category.name}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default CategorySelect;