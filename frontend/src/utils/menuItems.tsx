import type { ReactElement } from 'react'
import { dashboard, expenses, transactions, trend, categories } from '../utils/Icons'

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
    }
]
