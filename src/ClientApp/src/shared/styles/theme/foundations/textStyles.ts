import {TTextStyles} from 'shared/types/theme/foundations/textStyles'

// 1 rem = 16px

export default {
  textStyles: {
    title: {
      // we can also use responsive styles
      fontSize: '.9375rem',
      fontWeight: '600',
      fontFamily: `BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'`
      //lineHeight: '100%',
      // letterSpacing: '-2%',
    },
    primary: {
      fontSize: '.875rem',
      fontWeight: '600',
      fontFamily: `BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'`
    },
    secondary: {
      fontSize: '.8125rem',
      fontFamily: `BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'`
    },
    tertiary: {
      fontSize: '.75rem',
      fontFamily: `BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji'`
    },
  }
} satisfies TTextStyles
