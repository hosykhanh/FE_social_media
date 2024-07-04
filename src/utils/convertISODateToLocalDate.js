import dayjs from 'dayjs';

const convertISODateToLocalDate = (isoDate) => {
    const date = dayjs(isoDate).toDate();
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return formattedDate;
};

export default convertISODateToLocalDate;
