import 'package:evaluateai/providers/classes.dart';
import 'package:evaluateai/providers/evaluators.dart';
import 'package:evaluateai/providers/shop.dart';
import 'package:evaluateai/screens/splash.dart';
import 'package:evaluateai/utils/colors.dart';
import 'package:evaluateai/utils/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:get/route_manager.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

void main() {
  Stripe.merchantIdentifier = appName;
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => EvaluatorsProvider()),
        ChangeNotifierProvider(create: (context) => ClassesProvider()),
        ChangeNotifierProvider(create: (context) => ShopProvider()),
      ],
      child: GetMaterialApp(
        title: 'EvaluateAI',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(
            seedColor: primaryColor,
          ),
          useMaterial3: true,
          textTheme: GoogleFonts.golosTextTextTheme(),
        ),
        home: const SplashScreen(),
      ),
    );
  }
}
