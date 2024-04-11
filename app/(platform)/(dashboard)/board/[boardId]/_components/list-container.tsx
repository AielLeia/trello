'use client';

import { ListWithCards } from '@/type';

import ListForm from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form';

type ListContainerProps = {
  data: ListWithCards[];
  boardId: string;
};

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      <div className="flex shrink-0 w-1" />
    </ol>
  );
};

export default ListContainer;
