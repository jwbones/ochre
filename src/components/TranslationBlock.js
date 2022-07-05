import React, { Component } from 'react';
import './TranslationBlock.css';

class TranslationBlock extends React.Component {
    render() {
        const {blockJson, id} = this.props;
        return (
            <div className="Block" id={id}>
            <p className='Text'>{blockJson.text_orig}</p>
            <p className='Text'>{blockJson.text}</p>
            <p className='Text'>deepl: {blockJson.text_deepl}</p>
            </div>
        )

    }
}


export default TranslationBlock;