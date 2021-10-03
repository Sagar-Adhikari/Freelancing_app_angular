import {Pipe, PipeTransform} from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: "formatString"})
export class FormatStringPipe implements PipeTransform {

	constructor(private sanitizer:DomSanitizer){}

    transform(value: string) {

    	var regex = /(<([^>]+)>)/ig;

    	var new_value = value.replace(regex, "");

      	var emojis = [  {'key' : ':point_up:' , 'value' : '261d'},
						{'key' : ':heart:' , 'value' : '2665'},
						{'key' : ':thumbsup:' , 'value' : '1f44d'},
						{'key' : ':thumbsdown:' , 'value' : '1f44e'},
						{'key' : ':grin:' , 'value' : '1f601'},
						{'key' : ':smile:' , 'value' : '1f604'},
						{'key' : ':laughing:' , 'value' : '1f606'},
						{'key' : ':wink:' , 'value' : '1f609'},
						{'key' : ':unamused:' , 'value' : '1f612'},
						{'key' : ':pensive:' , 'value' : '1f614'},
						{'key' : ':stuck_out_tongue_winking_eye:' , 'value' : '1f61c'},
						{'key' : ':stuck_out_tongue_closed_eyes:' , 'value' : '1f61d'},
						{'key' : ':disappointed:' , 'value' : '1f61e'},
						{'key' : ':grinning:' , 'value' : '1f600'},
						{'key' : ':neutral_face:' , 'value' : '1f610'},
						{'key' : ':expressionless:' , 'value' : '1f611'},
						{'key' : ':confused:' , 'value' : '1f615'},
						{'key' : ':stuck_out_tongue:' , 'value' : '1f61b'},
						{'key' : ':fearful:' , 'value' : '1f628'},
						{'key' : ':no_mouth:' , 'value' : '1f636'},
      				];
      	// this.sanitizer.bypassSecurityTrustHtml
        for(var key in emojis) {
          new_value = new_value.replace(new RegExp(emojis[key]['key'], 'g'), "<img src='assets/images/emoji/"+emojis[key]['value']+".png'>");
        }
        return this.linkify(new_value);
    }

    private linkify(plainText): string{
	    let replacedText;
	    let replacePattern1;
	    let replacePattern2;
	    let replacePattern3;

	    //URLs starting with http://, https://, or ftp://
	    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	    if (plainText.indexOf('/view-offer') > -1) {
	    	replacedText = plainText.replace(replacePattern1, '<a href="$1" target="_blank">View Details</a>');
	    }else{
	    	replacedText = plainText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');	
	    }
	    
	    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
	    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

	    //Change email addresses to mailto:: links.
	    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
	    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

	    return replacedText;
   }
}