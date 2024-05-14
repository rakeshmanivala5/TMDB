$(document).ready(function () {
  $("#searchForm").submit(function (event) {
    event.preventDefault();

    var searchQuery = $("#searchQuery").val().trim();
    var mediaType = $("#mediaType").val().trim();
    var apiKey = "c36efa1b0d48c9024d4eeebc9c895269";

    if (searchQuery === "") {
      alert("Please enter a title.");
      return;
    }

    var baseUrl = "https://api.themoviedb.org/3/search/";
    var url =
      baseUrl + mediaType + "?api_key=" + apiKey + "&query=" + searchQuery;

    $.ajax({
      url: url,
      dataType: "json",
      success: function (response) {
        var resultsContainer = $("#results");
        resultsContainer.empty(); // Clear previous results

        if (response.results.length > 0) {
          for (var i = 0; i < response.results.length; i++) {
            var result = response.results[i];
            var title = result.title || result.name; // Use title for movies, name for TV shows
            var posterPath = result.poster_path
              ? "https://image.tmdb.org/t/p/w185" + result.poster_path
              : "no-img.webp"; // Image for missing posters
            var releaseDate = result.release_date || result.first_air_date; // Use release_date for movies, first_air_date for TV shows
            var overview = result.overview;
            var originalLanguage = result.original_language;
            var voteAverage1 = result.vote_average;
            var voteAverage = voteAverage1.toFixed(1);
            var voteCount = result.vote_count;
            var popularity = result.popularity;

            // Determine the rating badge based on the voteAverage
            if (voteAverage >= 8) {
              ratingBadge =
                '<span class="badge badge-success">' +
                voteAverage +
                "/10 </span>";
            } else if (voteAverage >= 4 && voteAverage < 8) {
              ratingBadge =
                '<span class="badge badge-warning">' +
                voteAverage +
                "/10 </span>";
            } else {
              ratingBadge =
                '<span class="badge badge-danger">' +
                voteAverage +
                "/10 </span>";
            }

            // Create container for result info (excluding poster)
            var resultInfo = document.createElement("div");
            resultInfo.classList.add("result-info");

            var ratingElement = document.createElement("p");
            ratingElement.innerHTML =
              ratingBadge +
              "<small style='font-size: .675em'>(" +
              voteCount +
              ")</small>";
            resultInfo.appendChild(ratingElement);

            // Build the result HTML structure
            var resultHtml = '<div class="result col-md-5 sm-12">';
            resultHtml += "<h2>" + title + "</h2>";
            resultHtml +=
              '<img src="' + posterPath + '" alt="' + title + ' poster">';
            resultHtml += resultInfo.outerHTML;
            resultHtml += "<p>Release Date: " + releaseDate + "</p>";
            resultHtml += "<p>Popularity: " + popularity + "</p>";
            resultHtml +=
              "<p>Original Language: <span style='text-transform: uppercase;'>" +
              originalLanguage +
              "</span></p><p></p>";

            // Initially show only one line of overview with a "Read More" button
            resultHtml +=
              "<div class='overview-content'>" +
              overview.substr(0, overview.indexOf(" ", 85)) +
              "...</div>"; // Add overview content
            resultHtml += '<a class="read-more-btn">Read More</a>';
            resultHtml += "</div>";

            resultsContainer.append(resultHtml);
          }

          // Toggle overview between one line and full overview
          $(".read-more-btn").click(function () {
            var overviewContent = $(this).prev(".overview-content");
            overviewContent.toggleClass("full-overview");
            $(this).text(
              overviewContent.hasClass("full-overview")
                ? "Read Less"
                : "Read More"
            );
            if (overviewContent.hasClass("full-overview")) {
              overviewContent.text(overview);
            } else {
              overviewContent.text(
                overview.substr(0, overview.indexOf(" ", 100)) + "..."
              );
            }
          });
        } else {
          resultsContainer.append("<p>No results found.</p>");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error:", textStatus, errorThrown);
        $("#results").append("<p>Error fetching data. Please try again.</p>");
      },
    });
  });
});
