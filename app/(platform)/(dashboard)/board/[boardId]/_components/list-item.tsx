'use client';

import { ListWithCards } from '@/type';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ElementRef, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import CardForm from '@/app/(platform)/(dashboard)/board/[boardId]/_components/card-form';
import CardItem from '@/app/(platform)/(dashboard)/board/[boardId]/_components/card-item';
import ListHeader from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-header';

type ListItemProps = {
  data: ListWithCards;
  index: number;
};

const ListItem = ({ data, index }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<'textarea'>>(null);

  const [isEditing, setEditing] = useState(false);

  const enableEditing = () => {
    setEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };
  const disableEditing = () => {
    setEditing(false);
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-[#F1F2F4] shadow-md pb-2"
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data.id} type="card">
              {(provided1) => (
                <ol
                  ref={provided1.innerRef}
                  {...provided1.droppableProps}
                  className={cn(
                    'mx-1 px-1 py-0.5 flex flex-col gap-y-2',
                    data.card.length > 0 ? 'mt-2' : 'mt-0'
                  )}
                >
                  {data.card.map((card, index) => (
                    <CardItem index={index} key={card.id} data={card} />
                  ))}
                  {provided1.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              boardId={data.boardId}
              ref={textareaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};

export default ListItem;
