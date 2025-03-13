import 'dart:convert';

import 'package:evaluateai/utils/utils.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class Server {
  static SharedPreferences? prefs;

  static Future<http.Response> get(String url) async {
    prefs = await SharedPreferences.getInstance();
    String? token = prefs!.getString("token");

    Map<String, String> headers = {"Authorization": "Bearer $token"};

    return await http.get(Uri.parse(serverUrl + url), headers: headers);
  }

  static Future<http.Response> post(
      String url, Map<String, dynamic> body) async {
    prefs = await SharedPreferences.getInstance();
    String? token = prefs!.getString("token");

    Map<String, String> headers = {
      "Authorization": "Bearer $token",
      "Content-Type": "application/json"
    };

    return await http.post(
      Uri.parse(serverUrl + url),
      headers: headers,
      body: jsonEncode(body),
    );
  }

  static Future<http.Response> postWithToken(
      String url, Map<String, dynamic> body, String token) async {
    Map<String, String> headers = {
      "Authorization": "Bearer $token",
      "Content-Type": "application/json"
    };

    return await http.post(
      Uri.parse(serverUrl + url),
      headers: headers,
      body: jsonEncode(body),
    );
  }
}
