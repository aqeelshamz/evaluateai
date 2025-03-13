import 'dart:convert';
import 'package:evaluateai/screens/auth/login.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  _SignUpScreenState createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  // Controllers to capture user input
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _verificationCodeController =
      TextEditingController();

  // State variables
  bool _verificationCodeSent = false;
  bool _loading = false;

  // Function to display SnackBar messages
  void _showSnackBar(String message, {Color color = Colors.red}) {
    final snackBar = SnackBar(
      content: Text(message),
      backgroundColor: color,
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  // Function to handle sending verification code
  Future<void> _sendVerificationCode() async {
    final String name = _nameController.text.trim();
    final String email = _emailController.text.trim();
    final String password = _passwordController.text.trim();

    // Basic validation
    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      _showSnackBar('Please fill out all fields.');
      return;
    }

    setState(() {
      _loading = true;
    });

    final Uri url = Uri.parse('$serverUrl/users/send-verification-code');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${await _getToken()}',
        },
        body: jsonEncode({'email': email}),
      );

      if (response.statusCode == 200) {
        setState(() {
          _verificationCodeSent = true;
        });
        _showSnackBar('Verification Code Sent!', color: Colors.green);
      } else {
        final Map<String, dynamic> errorData = jsonDecode(response.body);
        _showSnackBar(errorData['message'] ?? 'Something went wrong!');
      }
    } catch (e) {
      _showSnackBar('An error occurred. Please try again.');
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  // Function to handle verifying email
  Future<void> _verifyEmail() async {
    final String name = _nameController.text.trim();
    final String email = _emailController.text.trim();
    final String password = _passwordController.text.trim();
    final String code = _verificationCodeController.text.trim();

    // Basic validation
    if (name.isEmpty || email.isEmpty || password.isEmpty || code.isEmpty) {
      _showSnackBar('Please fill out all fields.');
      return;
    }

    setState(() {
      _loading = true;
    });

    final Uri url = Uri.parse('$serverUrl/users/verify-email');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${await _getToken()}',
        },
        body: jsonEncode({'email': email, 'code': code}),
      );

      if (response.statusCode == 200) {
        _showSnackBar('Email verified!', color: Colors.green);
        _signup();
      } else {
        final Map<String, dynamic> errorData = jsonDecode(response.body);
        _showSnackBar(errorData['message'] ?? 'Verification failed!');
      }
    } catch (e) {
      _showSnackBar('An error occurred. Please try again.');
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  // Function to handle signing up
  Future<void> _signup() async {
    final String name = _nameController.text.trim();
    final String email = _emailController.text.trim();
    final String password = _passwordController.text.trim();

    // Basic validation
    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      _showSnackBar('Please fill out all fields.');
      return;
    }

    setState(() {
      _loading = true;
    });

    final Uri url = Uri.parse('$serverUrl/users/signup');

    try {
      final response = await http.post(
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${await _getToken()}',
        },
        body: jsonEncode({'name': name, 'email': email, 'password': password}),
      );

      if (response.statusCode == 201) {
        _showSnackBar('Account created!', color: Colors.green);
        // Optionally, store token and navigate to login or home
        // For example:
        // final Map<String, dynamic> responseData = jsonDecode(response.body);
        // SharedPreferences prefs = await SharedPreferences.getInstance();
        // await prefs.setString('token', responseData['token']);
        // Navigator.pushReplacementNamed(context, '/home');

        // Navigate to Login after a short delay
        Future.delayed(const Duration(seconds: 1), () {
          Navigator.pushReplacementNamed(context, '/login');
        });
      } else {
        final Map<String, dynamic> errorData = jsonDecode(response.body);
        _showSnackBar(errorData['message'] ?? 'Sign up failed!');
      }
    } catch (e) {
      _showSnackBar('An error occurred. Please try again.');
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  // Function to retrieve token from SharedPreferences
  Future<String?> _getToken() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // Function to handle button press based on verification state
  void _handleButtonPress() {
    if (_loading) return;

    if (!_verificationCodeSent) {
      _sendVerificationCode();
    } else {
      _verifyEmail();
    }
  }

  @override
  void initState() {
    super.initState();
    _checkExistingToken();
  }

  // Check if token exists and navigate to home if it does
  Future<void> _checkExistingToken() async {
    String? token = await _getToken();
    if (token != null) {
      // Optionally, verify token validity with the server here
      Navigator.pushReplacementNamed(context, '/home');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                appName,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 40),
              const Text(
                'Sign Up',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  const Text(
                    "Already have an account? ",
                  ),
                  TextButton(
                    onPressed: () {
                      Get.offAll(() => const LoginScreen());
                    },
                    child: const Text('Login'),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              const Text(
                'Full Name',
              ),
              const SizedBox(height: 5),
              TextField(
                controller: _nameController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Enter your full name',
                  filled: true,
                ),
                keyboardType: TextInputType.name,
              ),
              const SizedBox(height: 20),
              const Text(
                'Email',
              ),
              const SizedBox(height: 5),
              TextField(
                controller: _emailController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Enter your email',
                  filled: true,
                ),
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 20),
              const Text(
                'Password',
              ),
              const SizedBox(height: 5),
              TextField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Enter your password',
                  filled: true,
                ),
                obscureText: true,
              ),
              const SizedBox(height: 20),
              if (_verificationCodeSent) ...[
                const Text(
                  'Verification Code',
                ),
                const SizedBox(height: 5),
                TextField(
                  controller: _verificationCodeController,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    hintText: 'Enter verification code',
                    filled: true,
                  ),
                  keyboardType: TextInputType.number,
                ),
                const SizedBox(height: 20),
              ],
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _handleButtonPress,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.all(15),
                    backgroundColor: primaryColor, // Use your primary color
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: _loading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                          ),
                        )
                      : Text(
                          !_verificationCodeSent
                              ? 'Send Verification Code'
                              : 'Create Account',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
