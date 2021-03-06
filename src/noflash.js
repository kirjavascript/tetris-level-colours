import React, { useState } from 'react';
import { render } from 'react-dom';

const byteSequence = [0xa9,0x3f,
    0x8d,0x06,0x20,
    0xa9,0x0e,
    0x8d,0x06,0x20];

function findOffset(rom) {
    return rom.findIndex((_, i, a) => {
        return a.slice(i, i + byteSequence.length).every((d, i) => d === byteSequence[i]);
    });
}

function genie(address, value) {
    const code = [];
    code[0] = (value & 7) + ((value >> 4) & 8);
    code[1] = ((value >> 4) & 7) + ((address >> 4) & 8);
    code[2] = (address >> 4) & 7;
    code[3] = (address >> 12) + (address & 8);
    code[4] = (address & 7) + ((address >> 8) & 8);
    code[5] = (address >> 8) & 7;
    code[5] += value & 8;
    return code.map((d) => 'APZLGITYEOXUKSVN'[d]).join('');
}

function LevelColours() {
    const [offset, setOffset] = useState(0x9673);

    return (
        <main>
            <h1>disable tetris flash in any rom</h1>

            <p className="offset">
                flash code offset: <strong>0x{offset.toString(16)}</strong>{' '}
                <label htmlFor="file" className="file">
                    use custom ROM
                </label>
                <input
                    id="file"
                    type="file"
                    onChange={(e) => {
                        const reader = new FileReader();
                        reader.readAsArrayBuffer(e.target.files[0]);
                        reader.onloadend = () => {
                            const rom = [...new Uint8Array(reader.result)];
                            const offset = findOffset(rom.slice(0x10));
                            if (offset !== -1) {
                                setOffset(offset + 0x8000);
                            } else {
                                alert(
                                    'ROM doesnt contain byte sequence',
                                );
                            }
                        };
                        e.preventDefault();
                    }}
                />
            </p>
            <pre>{genie(offset + 0x1 - 0x8000, 0x16)}</pre>
        </main>
    );
}

render(
    <LevelColours />,
    document.body.appendChild(document.createElement('div')),
);
