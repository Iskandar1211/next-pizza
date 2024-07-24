import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code is required' }, { status: 400 });
  }

  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      code,
    },
  });

  if (!verificationCode) {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 });
  }

  if (verificationCode.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Code expired' }, { status: 400 });
  }

  await prisma.user.update({
    where: {
      id: verificationCode.userId,
    },
    data: {
      verified: new Date(),
    },
  });

  await prisma.verificationCode.delete({
    where: {
      id: verificationCode.id,
    },
  });

  return NextResponse.redirect(new URL('/?verified', req.url));
}
