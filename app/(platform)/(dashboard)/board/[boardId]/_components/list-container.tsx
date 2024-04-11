'use client';

import { ListWithCards } from '@/type';
import { useEffect, useState } from 'react';

import ListForm from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form';
import ListItem from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item';

type ListContainerProps = {
  data: ListWithCards[];
  boardId: string;
};

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, index) => (
        <ListItem key={list.id} data={list} index={index} />
      ))}
      <ListForm />
      <div className="flex shrink-0 w-1" />
    </ol>
  );
};

export default ListContainer;
