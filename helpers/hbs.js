const moment = require('moment');

module.exports = {
	truncate: function(str, len) {
		if(str.length > len && str.length > 0) {
			var new_str = str + " ";
			new_str = str.substr(0, len);
			new_str = str.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : str.substr(0, len);
			return new_str + "...";
		}
		return str;
	},
	stripTags: function(input) {
		return input.replace(/<(?:.|\n)*?>/gm, '');		
	},
	formatDate: function(date, format) {
		return moment(date).format(format);
	},
	select: function(selected, options) {
//			the way replace works: first parameter - pattern... this will get matched over data.
//				if there are matches, they will be replaced by the second parameter (this a String or a Function called on match)
//			$& inserts the matched string inside the new string

//			this code finds the element that is meant to be selected by the 'value' parameter and adds the string 'selected'
		return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"')
//			this code finds the element that is meant to be selected by the TEXT inside the element and adds 'selected' before
			.replace(new RegExp('>' + selected + '</option>'), 'selected="selected"$&');
//			in other words, this is just symmetry (you can select by text or value)
	},
	editIcon: function(storyUser, loggedUser, storyId, floating = true) {
		if (storyUser == loggedUser) {
			if (floating) {
				return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red">
					<i class="fa fa-pencil"></i></a>`;
			} else {
				return `<a href="/stories/edit/${storyId}">
					<i class="fa fa-pencil"></i></a>`;
			}
		} else {
			return '';
		}
	}

}