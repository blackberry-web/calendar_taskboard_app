import { createUseStyles } from 'react-jss';
import { Card } from 'antd';
import { Holiday } from '../types/types';

const useStyles = createUseStyles({
    holidayCard: {
        'text-align': 'start',
        'font-family': 'verdana',
        'font-size': '10px',
        'width': '170px',
        'height': '20px',
        'z-index': '1',
        'overflow': 'hidden',
        'margin-left': '5px',
        'fontWeight': 'normal',
        'backgroundColor': 'rgb(235,235,235)'
    }
});

export const HolidayCard = (props: { dailyHoliday: Holiday, index: number}) => {
    const classes = useStyles();
    const { dailyHoliday, index } = props;

    return(
        <> 
           <Card
                key={index}
                hoverable
                className={classes.holidayCard}
                styles={{ body: { padding: '0px 0px 0px 5px' }}}
                >
                {dailyHoliday.name}
            </Card>
        </>
)};