'use client';

import { ListWithCards } from '@/type';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import updateCardOrder from '@/actions/update-card-order';
import updateListOrder from '@/actions/update-list-order';

import { useAction } from '@/hooks/use-action';

import ListForm from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form';
import ListItem from '@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item';

type ListContainerProps = {
  data: ListWithCards[];
  boardId: string;
};

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const { execute: executeReorderList } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success(`Lists reordered successfully.`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeReorderCard } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success(`Cards reordered successfully.`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // User move a list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      await executeReorderList({ boardId, items });
    }

    // User move a card
    if (type === 'card') {
      let newOrderedData = [...orderedData];

      // Source and Destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) return;

      // Check if cards exists on the sourceList
      if (!sourceList.card) {
        sourceList.card = [];
      }

      // Check if card exists on the destinationList
      if (!destinationList.card) {
        destinationList.card = [];
      }

      // Moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.card,
          source.index,
          destination.index
        );
        reorderedCards.forEach((card, index) => (card.order = index));
        sourceList.card = reorderedCards;
        setOrderedData(newOrderedData);

        await executeReorderCard({ boardId, items: reorderedCards });
      } else {
        // User moves the card to another list

        // Remove card form the source list
        const [movedCard] = sourceList.card.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add the card to the destination list
        destinationList.card.splice(destination.index, 0, movedCard);

        sourceList.card.forEach((card, index) => (card.order = index));

        // Update the order for each card in the destination list
        destinationList.card.forEach((card, index) => (card.order = index));

        setOrderedData(newOrderedData);
        await executeReorderCard({ boardId, items: destinationList.card });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} data={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
