import type { ReactElement } from 'react'
import { dashboard, expenses, transactions, categories, trend} from '../utils/Icons'

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
        id: 7,
        title: 'Sổ chi tiêu tháng',
        icon: transactions,
        link: '/monthly-report'
    },
    {
        id: 5,
        title: 'Danh mục chi tiêu',
        icon: categories,   
        link: '/categories' 
    },
    {
        id: 8,
        title: 'Định mức chi tiêu',
        icon: trend,
        link: '/budgets'
    },
    {
        id: 6,
        title: 'Khoản chi tiêu',
        icon: expenses,
        link: '/expenses'
    },
    
    
]
