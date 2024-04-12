'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@prisma/client';

type CardItemProps = {
  data: Card;
  index: number;
};

const CardItem = ({ data, index }: CardItemProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          className="truncate border-2 border-transparent hover:border-black py-2 px-2 text-sm bg-white rounded-md shadow-md"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
