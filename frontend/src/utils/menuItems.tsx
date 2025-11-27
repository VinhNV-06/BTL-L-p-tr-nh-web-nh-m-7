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
        title: 'Trang chủ',
        icon: dashboard,
        link: '/dashboard'
    },
    {
        id: 2,
        title: 'Chi tiêu tháng',
        icon: transactions,
        link: '/dashboard'
    },
    {
        id: 3,
        title: 'Thu nhập',
        icon: trend,
        link: '/dashboard'
    },
    {
        id: 4,
        title: 'Chi tiêu',
        icon: expenses,
        link: '/dashboard'
    }
]
