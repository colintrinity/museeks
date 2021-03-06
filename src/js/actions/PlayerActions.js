import store from '../store.js';
import AppConstants  from '../constants/AppConstants';

import ToastsActions from './ToastsActions';

import app from '../lib/app';
import Player from '../lib/player';

const ipcRenderer    = electron.ipcRenderer;

const audioErrors = {
    aborted:  'The video playback was aborted.',
    corrupt:  'The audio playback was aborted due to a corruption problem.',
    notFound: 'The track file could not be found. It may be due to a file move or an unmounted partition.',
    unknown:  'An unknown error occurred.',
};


const playToggle = () => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_TOGGLE
    });
};

const play = () => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_PLAY
    });
};

const pause = () => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_PAUSE
    });
};

const stop = () => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_STOP
    });

    ipcRenderer.send('playerAction', 'stop');
};

const next = (e) => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_NEXT,
        e
    });
};

const previous = () => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_PREVIOUS
    });
};

const shuffle = (shuffle) => {
    app.config.set('audioShuffle', shuffle);
    app.config.saveSync();

    store.dispatch({
        type : AppConstants.APP_PLAYER_SHUFFLE,
        shuffle
    });
};

const repeat = (repeat) => {
    app.config.set('audioRepeat', repeat);
    app.config.saveSync();

    store.dispatch({
        type : AppConstants.APP_PLAYER_REPEAT,
        repeat
    });
};

const setVolume = (volume) => {
    if(!isNaN(parseFloat(volume)) && isFinite(volume)) {
        Player.setAudioVolume(volume);

        app.config.set('audioVolume', volume);
        app.config.saveSync();
        store.dispatch({
            type : AppConstants.APP_REFRESH_CONFIG
        });
    }
};

const setMuted = (muted = false) => {
    if(muted) Player.mute();
    else Player.unmute();

    app.config.set('audioMuted', muted);
    app.config.saveSync();
    store.dispatch({
        type : AppConstants.APP_REFRESH_CONFIG
    });
};

const setPlaybackRate = (value) => {
    if(!isNaN(parseFloat(value)) && isFinite(value)) { // if is numeric
        if(value >= 0.5 && value <= 5) { // if in allowed range
            Player.setAudioPlaybackRate(value);

            app.config.set('audioPlaybackRate', parseFloat(value));
            app.config.saveSync();
            store.dispatch({
                type : AppConstants.APP_REFRESH_CONFIG
            });
        }
    }
};

const jumpTo = (to) => {
    store.dispatch({
        type : AppConstants.APP_PLAYER_JUMP_TO,
        to
    });
};

const audioError = (e) => {
    switch (e.target.error.code) {
        case e.target.error.MEDIA_ERR_ABORTED:
            ToastsActions.add('warning', audioErrors.aborted);
            break;
        case e.target.error.MEDIA_ERR_DECODE:
            ToastsActions.add('danger', audioErrors.corrupt);
            break;
        case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            ToastsActions.add('danger', audioErrors.notFound);
            break;
        default:
            ToastsActions.add('danger', audioErrors.unknown);
            break;
    }
};


export default {
    audioError,
    jumpTo,
    next,
    pause,
    play,
    playToggle,
    previous,
    repeat,
    setMuted,
    setPlaybackRate,
    setVolume,
    shuffle,
    stop,
    audioErrors
};
