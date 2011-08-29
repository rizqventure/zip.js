(function() {

	var model, view, controller;

	function onerror(message) {
		console.error(message);
	}

	model = (function() {
		var unzipper, outputFile;

		return {
			getEntries : function(file, onend) {
				unzipper = zip.createReader(file);
				unzipper.getEntries(onend, onerror);
			},
			getEntryFile : function(entry, onend, onprogress) {
				entry.getData(onend, onprogress, onerror);
			}
		};
	})();

	controller = {
		getEntries : function(file, onend) {
			model.getEntries(file, onend);
		},
		getEntryFile : function(entry, onend, onprogress) {
			model.getEntryFile(entry, onend, onprogress);
		}
	};

	view = (function() {
		var fileInput = document.getElementById("file-input");
		var unzipProgress = document.createElement("progress");
		var fileList = document.getElementById("file-list");
		fileInput.addEventListener('change', function(event) {
			fileInput.disabled = true;
			view.onFileInputChange(fileInput);
		}, false);
		return {
			getEntries : function(entries) {
				fileList.innerHTML = "";
				entries.forEach(function(entry) {
					var li = document.createElement("li");
					var a = document.createElement("a");
					a.innerText = entry.filename;
					a.href = "#";
					a.addEventListener("click", function(event) {
						view.onEntryClick(entry, li);
						event.preventDefault();
						return false;
					}, false);
					li.appendChild(a);
					fileList.appendChild(li);
				});
			},
			getEntryFile : function(blob) {
				var URL = webkitURL || mozURL || URL;
				if (unzipProgress.parentNode)
					unzipProgress.parentNode.removeChild(unzipProgress);
				unzipProgress.value = 0;
				unzipProgress.max = 0;
				location.href = URL.createObjectURL(blob);
			},
			progressUnzip : function(current, total, li) {
				unzipProgress.value = current;
				unzipProgress.max = total;
				if (!unzipProgress.parentNode)
					li.appendChild(unzipProgress);
			}
		};
	})();

	view.onFileInputChange = function(fileInput) {
		controller.getEntries(fileInput.files[0], view.getEntries);
	};
	view.onEntryClick = function(entry, li) {
		controller.getEntryFile(entry, view.getEntryFile, function(current, total) {
			view.progressUnzip(current, total, li);
		});
	};

})();