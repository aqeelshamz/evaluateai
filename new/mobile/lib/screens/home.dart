import 'package:evaluateai/screens/pages/classes/classes.dart';
import 'package:evaluateai/screens/pages/evaluators/evaluators.dart';
import 'package:evaluateai/screens/pages/profile/profile.dart';
import 'package:evaluateai/screens/pages/shop/shop.dart';
import 'package:flutter/material.dart';
import 'package:flutter_feather_icons/flutter_feather_icons.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int currentPageIndex = 0;
  PageController pageController = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: currentPageIndex == 3
          ? null
          : FloatingActionButton(
              onPressed: () {},
              child: Icon(currentPageIndex == 2
                  ? FeatherIcons.shoppingCart
                  : FeatherIcons.plus),
            ),
      bottomNavigationBar: NavigationBar(
        onDestinationSelected: (int index) {
          setState(() {
            currentPageIndex = index;
          });
          pageController.jumpToPage(index);
        },
        selectedIndex: currentPageIndex,
        destinations: const <Widget>[
          NavigationDestination(
            icon: Icon(FeatherIcons.play),
            label: 'Evaluators',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.users),
            label: 'Classes',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.shoppingBag),
            label: 'Shop',
          ),
          NavigationDestination(
            icon: Icon(FeatherIcons.user),
            label: 'Profile',
          ),
        ],
      ),
      body: SafeArea(
        child: PageView(
          controller: pageController,
          children: const <Widget>[
            EvaluatorsPage(),
            ClassesPage(),
            ShopPage(),
            ProfilePage(),
          ],
          onPageChanged: (int index) {
            setState(() {
              currentPageIndex = index;
            });
          },
        ),
      ),
    );
  }
}
