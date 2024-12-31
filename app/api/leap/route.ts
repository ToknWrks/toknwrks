import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Simulate fetching data or performing some operations
    const data = { message: 'Success' }
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Error in /api/leap:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}