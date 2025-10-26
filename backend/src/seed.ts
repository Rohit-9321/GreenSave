import bcrypt from 'bcryptjs'
import { prisma } from './prisma.js'

async function createUser(email: string, name: string, password: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name, passwordHash: bcrypt.hashSync(password,10) }
  })
}

async function createChallenge(title: string, description: string) {
  return prisma.challenge.create({ data: { title, description } })
}

async function joinChallenge(userId: number, challengeId: number) {
  await prisma.userChallenge.upsert({
    where: { userId_challengeId: { userId, challengeId } },
    update: {},
    create: { userId, challengeId }
  })
}

async function addAction(userId: number, challengeId: number | null, type: string, amount: number, co2: number) {
  await prisma.action.create({ data: { userId, challengeId: challengeId || undefined, type, amount, co2Saved: co2 } })
}

async function main() {
  const users = [
    ['alice@example.com','Alice','alice123'],
    ['bob@example.com','Bob','bob12345'],
    ['chloe@example.com','Chloe','chloe123'],
    ['demo@greensteps.app','Demo User','demo1234']
  ]
  const u = await Promise.all(users.map(([e,n,p]) => createUser(e,n,p)))

  const challenges = [
    ['Bike-to-Work Week','Cycle to work and log kilometers.'],
    ['Meatless Mondays','Skip meat every Monday this month.'],
    ['Solar Sprint','Track home solar generation for 2 weeks.']
  ]
  const c = await Promise.all(challenges.map(([t,d]) => createChallenge(t,d)))

  for (const user of u) {
    for (const ch of c) {
      await joinChallenge(user.id, ch.id)
    }
  }

  // Add some actions
  for (let i=0;i<u.length;i++) {
    const uid = u[i].id
    await addAction(uid, c[0].id, 'bike', 12 + i*3, (12+i*3)*0.2)
    await addAction(uid, c[1].id, 'plant', 1 + i, (1+i)*21)
    await addAction(uid, c[2].id, 'solar', 5 + i*2, (5+i*2)*0.8)
  }

  // Create groups and members
  const g1 = await prisma.group.create({ data: { name: 'Eco Ninjas', ownerId: u[0].id } })
  const g2 = await prisma.group.create({ data: { name: 'Carbon Cutters', ownerId: u[1].id } })
  await prisma.groupMember.createMany({
    data: [
      { groupId: g1.id, userId: u[0].id, role: 'owner' },
      { groupId: g1.id, userId: u[2].id, role: 'member' },
      { groupId: g2.id, userId: u[1].id, role: 'owner' },
      { groupId: g2.id, userId: u[3].id, role: 'member' }
    ],
    skipDuplicates: true
  })

  console.log('Seeded.')
}

main().finally(()=>prisma.$disconnect())
