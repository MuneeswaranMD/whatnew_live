import 'package:url_launcher/url_launcher.dart';

class SimpleBrowser {
  static Future<void> open(String url) async {
    final Uri uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}
