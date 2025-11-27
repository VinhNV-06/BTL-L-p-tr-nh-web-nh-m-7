import moment from 'moment'

export const dateFormat = (date: string | Date | undefined): string => {
    if (!date) return ''
    return moment(date).format('DD/MM/YYYY')
}
