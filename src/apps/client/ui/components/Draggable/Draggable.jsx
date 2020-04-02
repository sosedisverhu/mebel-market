import React, { PureComponent } from 'react';
import pt from 'prop-types';
import noop from '@tinkoff/utils/function/noop';
import mergeWith from '@tinkoff/utils/object/mergeWith';

const preventEvent = (e) => e.preventDefault();
const LEFT_MOUSE_BUTTON = 0;
const getDelta = mergeWith((startCoord, nextCoord) => nextCoord - startCoord);

const STATUS_IDLE = 'idle';
const STATUS_WAITING = 'waiting';
const STATUS_DRAGGING = 'dragging';

export default class Draggable extends PureComponent {
    static propTypes = {
        /**
         * Атрибут data-qa-type
         */
        dataQaType: pt.string,
        /**
         * Tagname
         */
        tagName: pt.string,
        /**
         * обработчик начала перетаскивания
         */
        onDragStart: pt.func,
        /**
         * обработчик процесса перетаскивания
         */
        onDrag: pt.func,
        /**
         * обработчик конца перетаскивания
         */
        onDragEnd: pt.func,
        /**
         * время в мс, после которого нужно начинать перетаскивание
         */
        dragTimeout: pt.number,
        /**
         * расстояние в пикселях, после преодоления которого нужно начинать перетаскивание
         */
        dragThreshold: pt.number,
        /**
         * разрешать ли стандартные обработчики
         */
        allowDefaultAction: pt.bool,
        /**
         * Enable touch events
         */
        touchable: pt.bool,
        styles: pt.object
    };

    static defaultProps = {
        dataQaType: 'uikit/Draggable',
        touchable: false,
        tagName: 'div',
        onDragStart: noop,
        onDrag: noop,
        onDragEnd: noop,
        dragTimeout: 0,
        dragThreshold: 0,
        allowDefaultAction: false,
        styles: {}
    };

    componentWillUnmount () {
        this.removeListeners();
    }

    getNextDrag (drag) {
        return {
            ...drag,
            start: { ...this.startDrag },
            delta: mergeWith(getDelta, this.startDrag, drag)
        };
    }

    handleWrapper = (handler) => (e) => {
        if (!this.props.allowDefaultAction) {
            e.preventDefault();
            e.stopPropagation();
        }

        let touch;

        if (e.touches) {
            // тач-событие
            touch = e.touches[0] || this.drag;
            this.drag = touch; // touchEnd не возвращает координаты - запоминаем
        } else {
            // событие мыши
            if (e.button !== LEFT_MOUSE_BUTTON) {
                return;
            }

            touch = e;
        }

        const rect = this.self.getBoundingClientRect();

        const drag = {
            page: { x: touch.pageX, y: touch.pageY },
            client: { x: touch.clientX, y: touch.clientY },
            offset: {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top
            }
        };

        return handler(drag);
    };

    handleMouseDown = this.handleWrapper((drag) => {
        if (this.status !== STATUS_IDLE) {
            return;
        }

        this.startDrag = drag;
        this.status = STATUS_WAITING;

        return Promise.all([this.waitForTimeout(), this.waitForThreshold()])
            .then(() => this.props.onDragStart(this.getNextDrag(drag)))
            .then(() => {
                this.status = STATUS_DRAGGING;
                this.addListeners(this.handleMouseMove, this.handleMouseUp);
            })
            .catch(this.catchErr);
    });

    handleMouseMove = this.handleWrapper((drag) => this.props.onDrag(this.getNextDrag(drag)));

    handleMouseUp = this.handleWrapper((drag) => {
        this.removeListeners();

        const nextDrag = this.getNextDrag(drag);

        Promise.resolve(this.props.onDragEnd(nextDrag))
            .then(() => {
                this.status = STATUS_IDLE;
            })
            .catch(this.catchErr);
    });

    drag = null;

    catchErr = (err) => {
        this.status = STATUS_IDLE;
        if (err instanceof Error) {
            throw err;
        }
    };

    waitForTimeout () {
        return new Promise((resolve) => setTimeout(resolve, this.props.dragTimeout));
    }

    waitForThreshold () {
        return new Promise((resolve, reject) => {
            const handleMove = this.handleWrapper((drag) => {
                const { dragThreshold } = this.props;
                const { x, y } = getDelta(this.startDrag.page, drag.page);

                if (Math.sqrt(x * x + y * y) > dragThreshold) {
                    this.removeListeners();
                    resolve();
                }
            });

            const handleUp = this.handleWrapper(() => {
                this.removeListeners();
                reject(new Error());
            });

            this.addListeners(handleMove, handleUp);
        });
    }

    addListeners (handleMove, handleUp) {
        this.removeListeners();
        this.handleMove = handleMove;
        this.handleUp = handleUp;
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('touchmove', handleMove, { passive: false });
        document.addEventListener('mouseup', handleUp);
        document.addEventListener('touchend', handleUp);
    }

    removeListeners () {
        if (this.handleMove) {
            document.removeEventListener('mousemove', this.handleMove);
            document.removeEventListener('touchmove', this.handleMove);
            this.handleMove = null;
        }
        if (this.handleUp) {
            document.removeEventListener('mouseup', this.handleUp);
            document.removeEventListener('touchend', this.handleUp);
            this.handleUp = null;
        }
    }

    status = STATUS_IDLE;
    selfRef = (el) => {
        this.self = el;
    };

    render () {
        const {
            tagName: TagName,
            onDragStart,
            onDrag,
            onDragEnd,
            dragTimeout,
            dragThreshold,
            allowDefaultAction,
            dataQaType,
            touchable,
            styles,
            ...props
        } = this.props;

        return (
            <TagName
                data-qa-type={dataQaType}
                ref={this.selfRef}
                {...props}
                onDragOver={preventEvent}
                onDragEnd={preventEvent}
                onMouseDown={this.handleMouseDown}
                onTouchStart={touchable ? this.handleMouseDown : noop}
                style={styles}
            />
        );
    }
}
