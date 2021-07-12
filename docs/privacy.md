# Privacy Policy
CraftOS-PC and its components may collect some analytics data for purposes of improvement and statistical analysis. The amount of data that is collected is kept to a minimum, but there is still some information that is sent.

## CraftOS-PC
CraftOS-PC v2.5.3 introduces a crash dump uploader for Windows to allow bug reports to be automatically submitted without having to manually create an issue on GitHub. These files may contain the following information:
* Computer name
* Operating system/version
* CPU model & specs
* CraftOS-PC installation path

In addition, these dumps may contain arbitrary data in the memory of the CraftOS-PC process, including Lua variables, configuration settings, and system environment variables. However, this information will likely not be used as part of the diagnosis process.

Dumps are securely uploaded to a private Amazon AWS S3 bucket, which cannot be accessed by the public. Any files that are uploaded are stored until a) the crash is diagnosed, or b) 30 days have passed since upload, at which point the files will be permanently deleted. Crash dumps are encrypted using Amazon's server-side AES-256 encryption.

Uploaded crash dumps will never be sent to any third-party besides the server that receives the uploads. They are only used for diagnostic purposes, and no data other than what is necessary (including stack traces, values of variables, thread statuses, etc.) will be read.

Automatic crash uploads are disabled by default, but the user is prompted about this on first boot, or upon updating to v2.5.3. This setting can later be changed through the `snooperEnabled` configuration option.

For operating systems other than Windows, no data is collected.

## Website
The CraftOS-PC website uses Google Analytics for basic statistics, including view/download count, region information, and acquisition methods. This data has been anonymized as much as possible; however, Google may still collect data outside of the scope of the CraftOS-PC website.

Data collected by Google Analytics and processed for statistical analysis includes:
* Date/time of site visit
* System language setting
* City/country location
* Web browser
* Operating system
* ISP
* Screen resolution
* Acquisition source (e.g. Google search, Reddit link, direct browse)
* Page navigation flow
* Number of downloads

Only the basic Google Analytics services are in use - none of the advertising services are enabled (including the ones that do the most tracking). The data available through the Google Analytics console is detached from any other form of identification, so it is not possible to tie any of the data to any single person.

Google Analytics uses cookies to store information about new and returning visitors. These cookies are only scoped for the CraftOS-PC domain, and nothing besides Google Analytics uses them. They are only used to distinguish users.

General statistic graphs on site activity may be shared with other people on social media for informational and non-commercial purposes only. No data on more sensitive data, such as location and system information, may be shared with any third-party, besides what is collected by Google automatically.

If you wish to opt-out of Google Analytics data collection, you may use the [Google Analytics Opt-Out Tool](https://chrome.google.com/webstore/detail/google-analytics-opt-out/fllaojicojecljbmefodhfapmkghcbnh) to disable Google Analytics on all sites. Alternatively, you can install [uBlock Origin](https://ublockorigin.com/), which automatically blocks Google Analytics on all websites, as well as advertisements and other tracking tools.