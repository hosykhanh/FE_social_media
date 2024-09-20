import { Drawer } from 'antd';

function DrawerComp({ children, title = 'Drawer', placement = 'right', isOpen = false, ...rests }) {
    return (
        <>
            <Drawer width="35%" title={title} placement={placement} open={isOpen} {...rests}>
                {children}
            </Drawer>
        </>
    );
}

export default DrawerComp;
