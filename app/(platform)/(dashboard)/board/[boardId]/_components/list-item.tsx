'use client';

import { ListWithCards } from '@/type';

import ListHeader from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header';

type ListItemProps = {
  data: ListWithCards;
  index: number;
};

const ListItem = ({ data, index }: ListItemProps) => {
  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#F1F2F4] shadow-md pb-2">
        <ListHeader data={data} />
      </div>
    </li>
  );
};

export default ListItem;
