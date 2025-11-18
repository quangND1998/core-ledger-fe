interface Option {
  title: string
  status: boolean
}

interface Tab {
  icon: string
  title: string
  index: number
  options: Array<Option>
}

interface Group {
  name: string
  tabs: Array<Tab>
}

export const useTabs = () => {
  const groupTabs = ref<Array<Group>>([
    {
      name: 'GENERAL SETTINGS',
      tabs: [
        {
          icon: '/images/settings/language.svg',
          title: 'Language',
          index: 0,
          options: [
            {
              title: 'English',
              status: true,
            },
          ],
        },
        {
          icon: '/images/settings/payment.svg',
          title: 'Payment management',
          index: 1,
          options: [],
        },
        {
          icon: '/images/settings/security.svg',
          title: 'Security Settings',
          index: 2,
          options: [],
        },
      ],
    },
    {
      name: 'ABOUT WEALIFY',
      tabs: [
        {
          icon: '/images/settings/term.svg',
          title: 'Security Settings',
          index: 3,
          options: [],
        },
        {
          icon: '/images/settings/privacy.svg',
          title: 'Privacy Policy',
          index: 4,
          options: [],
        },
      ],
    },
  ])

  const tabs = computed(() =>
    Object.values(groupTabs.value).reduce<Array<Tab>>((list, { tabs }) => [...list, ...tabs], []),
  )

  const selectedTabIndex = ref<number>(0)

  const selectTab = (index: number) => (selectedTabIndex.value = index)

  const selectedTab = computed<Tab | undefined>(() => tabs.value.find(({ index }) => selectedTabIndex.value == index))

  const selectedOptions = computed<Array<Option>>(() => selectedTab.value?.options ?? [])

  return { groupTabs, tabs, selectedTab, selectedTabIndex, selectedOptions, selectTab }
}
