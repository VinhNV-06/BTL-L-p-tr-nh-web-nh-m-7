import type { ReactElement } from 'react'
import { dashboard, expenses, transactions, categories } from '../utils/Icons'

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
        id: 5,
        title: 'Danh mục chi tiêu',
        icon: categories,   
        link: '/categories' 
    },
    {
        id: 6,
        title: 'Quản lý khoản chi',
        icon: expenses,
        link: '/expenses'
    },
    {
        id: 7,
        title: 'Sổ chi tiêu tháng',
        icon: transactions,
        link: '/monthly-report'
    }
]
