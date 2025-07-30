import { NextResponse } from 'next/server'


export function middleware() {
  return NextResponse.next()
}

// Keep minimal matcher configuration for future use
export const config = {
  matcher: []
} 