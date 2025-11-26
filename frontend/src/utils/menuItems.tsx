import type { ReactElement } from 'react'
import { dashboard, expenses, transactions, trend } from '../utils/Icons'

interface MenuItem {
    id: number
    title: string
    icon: ReactElement
    link: string
}

export const menuItems: MenuItem[] = [
    {
        id: 1,
        title: 'Dashboard',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: 'View Transactions',
        icon: transactions,
        link: '/dashboard'
    },
    {
        id: 3,
        title: 'Incomes',
        icon: trend,
        link: '/dashboard'
    },
    {
        id: 4,
        title: 'Expenses',
        icon: expenses,
        link: '/dashboard'
    }
]
