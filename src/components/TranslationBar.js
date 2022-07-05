import React, { Component } from 'react';

import TranslationBlock from './TranslationBlock.js'

class TranslationBar extends React.Component {
    render() {
        const {blocks} = this.props;
        const translation_blocks = blocks.map((block, i) => {
            return (

                    <TranslationBlock blockJson={block} key={i} id={'block_' + block.block_index}></TranslationBlock>
            )
        })
        return (
            <ul style={{padding: '0px'}}>
                {translation_blocks}
            </ul>
        )
    }
}

export default TranslationBar;