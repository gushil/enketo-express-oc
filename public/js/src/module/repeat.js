// Modify the Enketo Core repeatmodule.
import repeatModule from 'enketo-core/src/js/repeat';
import events from './event';
import settings from './settings';
import reasons from './reasons';
import { t } from './translator';
import gui from './gui';
import $ from 'jquery';

/**
 * Overwrite core functionality by customizing repeat removal dialog
 */
repeatModule.originalConfirmDelete = repeatModule.confirmDelete;

repeatModule.confirmDelete = function( repeatEl ) {
    const that = this;
    if ( settings.reasonForChange ) {
        // Any form controls inside the repeat need a Reason for Change
        // TODO: exclude controls that have no value?
        const questions = repeatEl.querySelectorAll( '.question:not(.disabled)' );
        const texts = {
            heading: t( 'confirm.repeatremove.heading' ),
            msg: `${t( 'confirm.repeatremove.msg' )} ${t( 'fieldsubmission.prompt.reason.msg' )}`
        };
        const inputs = '<p><label><input name="reason" type="text"/></label></p>';

        gui.prompt( texts, {}, inputs )
            .then( values => {
                if ( !values ) {
                    return;
                } else if ( !values.reason || !values.reason.trim() ) {
                    // TODO: something
                    return;
                } else {
                    questions.forEach( q => q.dispatchEvent( events.ReasonChange( values ) ) );
                    that.remove( $( repeatEl ) );
                    reasons.updateNumbering();
                }
            } );
    } else {
        this.originalConfirmDelete.call( this, repeatEl );
    }
};
