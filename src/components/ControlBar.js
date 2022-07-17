import React, { Component } from 'react';

const lang_map = {
    Afrikaans:'af',
    Albanian:'sq',
    Amharic:'am',
    Arabic:'ar',
    Armenian:'hy',
    Azerbaijani:'az',
    Basque:'eu',
    Belarusian:'be',
    Bengali:'bn',
    Bosnian:'bs',
    Bulgarian:'bg',
    Catalan:'ca',
    Cebuano:'ceb',
    Chinese:'zh',
    Corsican:'co',
    Croatian:'hr',
    Czech:'cs',
    Danish:'da',
    Dutch:'nl',
    English:'en',
    Esperanto:'eo',
    Estonian:'et',
    Finnish:'fi',
    French:'fr',
    Frisian:'fy',
    Galician:'gl',
    Georgian:'ka',
    German:'de',
    Greek:'el',
    Gujarati:'gu',
    Haitian:'ht',
    Hausa:'ha',
    Hawaiian:'haw',
    Hebrew:'he',
    Hindi:'hi',
    Hmong:'hmn',
    Hungarian:'hu',
    Icelandic:'is',
    Igbo:'ig',
    Indonesian:'id',
    Irish:'ga',
    Italian:'it',
    Japanese:'ja',
    Javanese:'jv',
    Kannada:'kn',
    Kazakh:'kk',
    Khmer:'km',
    Kinyarwanda:'rw',
    Korean:'ko',
    Kurdish:'ku',
    Kyrgyz:'ky',
    Lao:'lo',
    Latin:'la',
    Latvian:'lv',
    Lithuanian:'lt',
    Luxembourgish:'lb',
    Macedonian:'mk',
    Malagasy:'mg',
    Malay:'ms',
    Malayalam:'ml',
    Maltese:'mt',
    Maori:'mi',
    Marathi:'mr',
    Mongolian:'mn',
    Burmese:'my',
    Nepali:'ne',
    Norwegian:'no',
    Nyanja:'ny',
    Odia:'or',
    Pashto:'ps',
    Persian:'fa',
    Polish:'pl',
    Portuguese:'pt',
    Punjabi:'pa',
    Romanian:'ro',
    Russian:'ru',
    Samoan:'sm',
    'Scots Gaelic':'gd',
    Serbian:'sr',
    Sesotho:'st',
    Shona:'sn',
    Sindhi:'sd',
    Sinhala:'si',
    Slovak:'sk',
    Slovenian:'sl',
    Somali:'so',
    Spanish:'es',
    Sundanese:'su',
    Swahili:'sw',
    Swedish:'sv',
    Tagalog:'tl',
    Tajik:'tg',
    Tamil:'ta',
    Tatar:'tt',
    Telugu:'te',
    Thai:'th',
    Turkish:'tr',
    Turkmen:'tk',
    Ukrainian:'uk',
    Urdu:'ur',
    Uyghur:'ug',
    Uzbek:'uz',
    Vietnamese:'vi',
    Welsh:'cy',
    Xhosa:'xh',
    Yiddish:'yi',
    Yoruba:'yo',
    Zulu:'zu',
}

class ControlBar extends React.Component {

    constructor() {
        super();
        this.state = {
            from: 'JA',
            to: 'EN',
        }
    }

    languageOptions(){
        return Object.entries(lang_map).map(([k,v]) => (<option value={v.toUpperCase()}>{k}</option>))
    }

    updateFrom = (event) => {
        this.setState({
            from: event.target.value
        })
    }

    updateTo = (event) => {
        this.setState({
            to: event.target.value
        })
    }

    componentDidUpdate () {
        window.electronAPI.updateLangs(this.state.from, this.state.to)
    }

    render() {
        return (
            <div style={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'flex-start'}}>
                <select value={this.state.from} onChange={this.updateFrom}>
                    <option value=''>--Specify a source language--</option>
                    {this.languageOptions()}
                </select>

                <select value={this.state.to} onChange={this.updateTo}>
                    <option value=''>--Specify a target language--</option>
                    {this.languageOptions()}
                </select>
            </div>
        )
    }
}

export default ControlBar;