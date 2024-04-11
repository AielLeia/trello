import { auth } from '@clerk/nextjs';
import { startCase } from 'lodash';
import { notFound, redirect } from 'next/navigation';
import React from 'react';

import db from '@/lib/db';
import { route } from '@/lib/route';

import BoardNavbar from '@/app/(platform)/(dashboard)/board/[boardId]/_components/board-navbar';

type UrlParams = {
  boardId: string;
};

type GenerateMetadataParams = {
  params: UrlParams;
};

type BoardIdLayoutProps = {
  children: React.ReactNode;
  params: UrlParams;
};

export async function generateMetadata({ params }: GenerateMetadataParams) {
  const { orgId } = auth();
  if (!orgId) {
    return {
      title: 'Board',
    };
  }

  const board = await db.board.findUnique({
    where: { id: params.boardId, orgId },
  });
  return {
    title: startCase(board?.title || 'Board'),
  };
}

const BoardIdLayout = async ({ children, params }: BoardIdLayoutProps) => {
  const { orgId } = auth();
  if (!orgId) {
    return redirect(route('/select-org'));
  }

  const board = await db.board.findUnique({
    where: { id: params.boardId, orgId },
  });
  if (!board) {
    return notFound();
  }

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full bg-no-repeat bg-cover bg-center"
    >
      <BoardNavbar data={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="pt-28 relative h-full">{children}</main>
    </div>
  );
};

export default BoardIdLayout;
