import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Button({
    to,
    href,
    primary = false,
    danger = false,
    outline = false,
    small = false,
    large = false,
    text = false,
    disable = false,
    rounded = false,
    square = false,
    normal = false,
    leftIcon = false,
    leftMostIcon = false,
    rightIcon = false,
    rightMostIcon = false,
    textLeft = false,
    textCenter = false,
    children,
    className,
    addIcon,
    onClick,
    onSubmit,
    ...passProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps,
    };

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    if (disable) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    const classes = cx('wrapper', {
        primary,
        danger,
        outline,
        small,
        large,
        text,
        disable,
        rounded,
        square,
        normal,
        [className]: className,
    });

    const classesChildren = cx('title', {
        'full-width': leftMostIcon || rightMostIcon,
        textLeft,
        textCenter,
    });

    return (
        <Comp className={classes} {...props}>
            {(leftMostIcon || leftIcon) && <span className={cx('icon')}>{addIcon}</span>}
            <span className={classesChildren}>{children}</span>
            {(rightMostIcon || rightIcon) && <span className={cx('icon')}>{addIcon}</span>}
        </Comp>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    href: PropTypes.string,
    primary: PropTypes.bool,
    outline: PropTypes.bool,
    small: PropTypes.bool,
    large: PropTypes.bool,
    text: PropTypes.bool,
    disable: PropTypes.bool,
    rounded: PropTypes.bool,
    square: PropTypes.bool,
    normal: PropTypes.bool,
    addIcon: PropTypes.node,
    children: PropTypes.node.isRequired,
    leftIcon: PropTypes.bool,
    leftMostIcon: PropTypes.bool,
    rightIcon: PropTypes.bool,
    rightMostIcon: PropTypes.bool,
    textLeft: PropTypes.bool,
    textCenter: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
