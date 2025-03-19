import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluator.dart';
import 'package:evaluateai/providers/shop.dart';
import 'package:evaluateai/providers/user.dart';
import 'package:evaluateai/screens/splash.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => UserProvider()),
        ChangeNotifierProvider(create: (context) => EvaluatorProvider()),
        ChangeNotifierProvider(create: (context) => ClassesProvider()),
        ChangeNotifierProvider(create: (context) => ShopProvider()),
      ],
      child: GetMaterialApp(
        theme: ThemeData(
          scaffoldBackgroundColor: Colors.white,
          navigationBarTheme: const NavigationBarThemeData(
            backgroundColor: Colors.white,
          ),
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
          fontFamily: GoogleFonts.poppins().fontFamily,
        ),
        home: SplashScreen(),
      ),
    );
  }
}
